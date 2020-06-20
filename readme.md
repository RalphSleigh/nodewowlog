# Nodewowlog

A World of Warcraft combat log parser written in Typescript, GraphQL and React.

## Usage

### Basic:

1) Download and install the latest release from the releases section. 

2) Turn on advanced combat logging in WoW options -> system -> network

3) Kill some bosses 

4) Open the application and select the log file in the chooser that pops up. This should be `WoWCombatLog.txt` in the `Logs` directory of your wow installation.

### Advanced:
 
If you already have node and git installed, you should be able to do:
 
```
git clone https://github.com/RalphSleigh/nodewowlog.git  
cd nodewowlog  
npm install  
npm run build  
npm start -- --log=c:\path\to\log.txt
```

Then browse to http://localhost:8080/

## FAQ

**Q. Why?**  
Lockdown, and I wanted a project to investigate GraphQL that's more interesting than a todo list.

**Q. Should I use this?**  
Probably not, but maybe some people want to parse logs locally without the log data leaving their computer.

**Q. Most of the spell icons are missing?**  
Two reasons here:
1. The Blizzard game data API is currently broken and not returning any data for most spells
2. By default, the app relies on a hard coded list of icons I have seen in logs. You can supply your own Blizzard API credentials on the command line with  `--apiKey` and `--apiSecret` to attempt to use the Blizzard API to find missing icons. 

**Q. I am getting dire warnings about running untrusted software from the internet**  
The warnings are correct, You really shouldn't run untrusted software from the internet. Unfortunately making them go away requires me to pay rather more for a code signing certificate that I am currently willing to sink into a toy project. 

**Q. Mac/Linux support?**  
The advanced method *should* run on Mac/Linux without any modifications.

## Todo:

* Buffs pane
* Player deaths pane
* More report cards
* Decide if I want to remove Spirit of Redemption absorption from the healing table. 