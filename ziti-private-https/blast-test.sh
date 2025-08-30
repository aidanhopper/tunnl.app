#!/bin/bash

WINDOW_NAME="blast_test"

# Create a new window in the current session
tmux new-window -n "$WINDOW_NAME"

# # Start the first pane with your command
tmux send-keys -t "$WINDOW_NAME" 'while true; do curl -kL https://test.service:443 ; echo "" ; done' C-m
#
# Create 11 more panes and run the same command
i=1
while [ $i -lt $(($1 + 1)) ]; do
    tmux split-window -t "$WINDOW_NAME" -h
    tmux select-layout -t "$WINDOW_NAME" tiled
    tmux send-keys -t "$WINDOW_NAME.$i" 'while true; do curl -kL https://test.service:443 ; echo "" ; done' C-m
    i=$(($i+1))
done
