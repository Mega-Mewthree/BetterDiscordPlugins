# WMClassFixX11

Fixes different release channels of Discord having the same WM_CLASS attribute on Linux (X11).

This allows you to have different release channels as separate icons in your taskbar and fixes being unable to start PTB/Canary if Stable is running. You should enable this plugin in each release channel you have.

Required Dependencies: wmctrl (`sudo apt-get install wmctrl`), x11-utils (`sudo apt-get install x11-utils`)
