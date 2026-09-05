@echo off
title Zenvitra Supabase Keepalive Daemon
echo ============================================================
echo Starting ZENVITRA Supabase Keepalive Activity Service
echo Target: mehyoegjgteuxhjnzxfz.supabase.co (Every 30 mins)
echo ============================================================
node scripts\supabase_keepalive.js
pause
