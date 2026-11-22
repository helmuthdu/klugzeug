#!/usr/bin/env bash
# Links klugzeug skills into the canonical agent folder and, optionally, into other client folders.
#
#   ~/.agents/skills/<name>   -> <repo>/skills/<name>        (one link per skill)
#   <client>/<name>           -> ~/.agents/skills/<name>     (one link per skill, per --client)
#
# Skills are self-contained and find each other as siblings, so every skill links into the same folder.
# Paths that are not links to this installation are never overwritten; they are reported.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENTS_HOME="${KLUGZEUG_HOME:-$HOME/.agents}"
SKILLS_HOME="$AGENTS_HOME/skills"
DRY_RUN=0
UNINSTALL=0
CLIENTS=()

usage() {
  cat <<'EOF'
Usage: install.sh [--dry-run] [--uninstall] [--client <dir>]...

  --client <dir>  Also link each skill into <dir> (repeatable), for example ~/.claude/skills.
                  The directory must already exist; it is never created.
  --dry-run       Print what would happen; change nothing.
  --uninstall     Remove links that point into this repository or into the canonical folder.

Environment:
  KLUGZEUG_HOME   Canonical agent folder (default: ~/.agents).
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1 ;;
    --uninstall) UNINSTALL=1 ;;
    --client)
      [[ $# -ge 2 ]] || { echo "--client needs a directory" >&2; exit 2; }
      CLIENTS+=("$2")
      shift
      ;;
    -h | --help) usage; exit 0 ;;
    *) echo "unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
  shift
done

# link <target> <path>: create <path> -> <target> unless something else already occupies <path>.
# Returns 1 when <path> is not usable, so callers can skip dependent links.
link() {
  local target="$1" path="$2"
  if [[ -L "$path" ]]; then
    if [[ "$(readlink "$path")" == "$target" ]]; then
      echo "ok       $path"
      return 0
    fi
    echo "skip     $path is a link to $(readlink "$path"), not klugzeug"
    return 1
  fi
  if [[ -e "$path" ]]; then
    echo "skip     $path exists and is not a link; resolve the name collision by hand"
    return 1
  fi
  if [[ $DRY_RUN -eq 1 ]]; then
    echo "would    link $path -> $target"
  else
    mkdir -p "$(dirname "$path")"
    ln -s "$target" "$path"
    echo "link     $path -> $target"
  fi
  return 0
}

# unlink_ours <path> <owned-prefix-or-exact-target>...: remove <path> only when it links to one of the targets.
unlink_ours() {
  local path="$1"
  shift
  [[ -L "$path" ]] || return 0
  local current
  current="$(readlink "$path")"
  for owned in "$@"; do
    if [[ "$current" == "$owned" || "$current" == "$owned"/* ]]; then
      if [[ $DRY_RUN -eq 1 ]]; then
        echo "would    remove $path"
      else
        rm "$path"
        echo "remove   $path"
      fi
      return 0
    fi
  done
  echo "skip     $path is a link to $current, not klugzeug"
}

SKILL_NAMES=()
for dir in "$REPO"/skills/*/; do
  [[ -f "$dir/SKILL.md" ]] && SKILL_NAMES+=("$(basename "$dir")")
done

if [[ $UNINSTALL -eq 0 ]]; then
  if ! node "$REPO/scripts/check-skills.mjs"; then
    echo "refusing to link: fix the problems above first" >&2
    exit 1
  fi
fi

echo "canonical: $SKILLS_HOME"
for name in "${SKILL_NAMES[@]}"; do
  if [[ $UNINSTALL -eq 1 ]]; then
    for client in ${CLIENTS[@]+"${CLIENTS[@]}"}; do
      unlink_ours "$client/$name" "$SKILLS_HOME/$name" "$REPO"
    done
    unlink_ours "$SKILLS_HOME/$name" "$REPO"
  else
    if link "$REPO/skills/$name" "$SKILLS_HOME/$name"; then
      for client in ${CLIENTS[@]+"${CLIENTS[@]}"}; do
        if [[ -d "$client" ]]; then
          link "$SKILLS_HOME/$name" "$client/$name" || true
        else
          echo "skip     client folder does not exist: $client"
        fi
      done
    else
      echo "skip     clients for $name: canonical link is not klugzeug's"
    fi
  fi
done

if [[ $DRY_RUN -eq 1 ]]; then
  echo "dry run complete: nothing was changed"
fi
