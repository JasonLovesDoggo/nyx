#!/bin/zsh
# project-repos.sh - Mapping of project names to GitHub repositories
# This file is sourced by generate-project-images.sh

typeset -A PROJECT_REPOS

# Assign values to the associative array.
# Note the syntax: key followed by value, separated by spaces within the ()
PROJECT_REPOS=(
    "abacus" "https://github.com/jasonlovesdoggo/abacus"
    "anubis" "https://github.com/TecharoHQ/anubis"
    "foodle" "https://github.com/JasonLovesDoggo/foodle"
    "hackathonscanada" "https://github.com/Hackathons-Canada/HackathonsCanada"
    "mctf" "https://github.com/mcpt/ctf"
    "metropolis" "https://github.com/wlmac/metropolis"
    "nyx" "https://github.com/JasonLovesDoggo/nyx"
    "partneredu" "https://github.com/JasonLovesDoggo/PartnerEdu"
    "physioquest" "https://github.com/JasonLovesDoggo/jamhacks"
    "quicture" "https://github.com/JasonLovesDoggo/quicture"
    "redditvideomakerbot" "https://github.com/elebumm/RedditVideoMakerBot"
    "scavenger" "https://github.com/wlmac/scavenger"
    "screentimeshowdown" "https://github.com/JasonLovesDoggo/screentimeshowdown"
    "toyreduce" "https://github.com/JasonLovesDoggo/toyreduce"
)

