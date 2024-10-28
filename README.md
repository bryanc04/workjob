# Automatic Workjob Assigner




<p align="center"><a href="https://www.bryanchu.ng"><img src="https://i.postimg.cc/mD0LqWYc/logo.png" alt="bryanchu.ng" width="200"/></a></p>






![Google Chrome](https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white)![Safari](https://img.shields.io/badge/Safari-000000?style=for-the-badge&logo=Safari&logoColor=white)![Tor](https://img.shields.io/badge/Tor-7D4698?style=for-the-badge&logo=Tor-Browser&logoColor=white)![Edge](https://img.shields.io/badge/Edge-0078D7?style=for-the-badge&logo=Microsoft-edge&logoColor=white)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=green)

![Windows 11](https://img.shields.io/badge/Windows%2011-%230079d5.svg?style=for-the-badge&logo=Windows%2011&logoColor=white)![macOS](https://img.shields.io/badge/mac%20os-000000?style=for-the-badge&logo=macos&logoColor=F0F0F0)


Developed by Bryan Chung (<a href="https://www.bryanchu.ng">www.bryanchu.ng</a>)


## Getting Started

A functioning browser, preferably among the ones listed above, will suffice (for now). 


Also, the following files are required (headers are case-sensitive):

### 1. Students File (.csv)
| Heading    | Value | Example |
| -------- | ------- |-----|
| Personal ID  | Internal ID of student   |3006|
| Full Name | Full Name of student    |Bryan Chung|
| Grade    | Grade of student   |12|
| D1B1    | 0 (indicating not free D1B1) or 1 (indicating free D1B1)   |1|
| D2B2    | 0 (indicating not free D2B2) or 1 (indicating free D2B2)   |0|
| ...    | ... |...|
(The DxBy list should continue for all Day-Block arrangements)


### 2. Workjobs File (.csv)
| Heading    | Value | Example |
| -------- | ------- |-----|
| name  | Name of workjob   |Dining Hall|
| type | T (if the workjob does not meet every block) or E (if the workjob meets every block)    |E|
| min    | Minimum number of students, for each block if type is E or in total if type is T   |6|
| max    | Maximum number of students, for each block if type is E or in total if type is T  |8|
| priority    | A number from 1-10 indicating how important the workjob is (lower is more important)   |5|
| periods    | The periods or blocks when the workjob meets |1,2,3 (if meeting on certain periods) or B1, B3, B4 (if meeting on certain blocks)|
| id    | The portion after the colon (:) as it appears on the veracross database |DINING-F|


### 3. All Classes File (.csv)
| Heading    | Value | Example |
| -------- | ------- |-----|
| Internal Class ID  | Internal class ID as it appears on veracross  |91206|
| Class ID | Class ID as it appears on veracross    |D1-B2-WJ:ATHCAGE-F|

## Usage

Visit: <a href="https://topicsa-workjob.netlify.app/">link</a>



Upon successful file upload and continuing, the program automatically assigns students to workjobs. 



[![Screenshot-2024-10-27-at-7-59-38-PM.png](https://i.postimg.cc/vZjN58b6/Screenshot-2024-10-27-at-7-59-38-PM.png)](https://postimg.cc/qNswTTtk)

By clicking the checkboxes on the left, the user can select which workjobs are visible and which ones are not.

On the bottom left, the user can choose to export the current status to two formats, .txt and .csv. The .txt allows for a more human-readable version of the current status, while the .csv is in the format the veracross database requires.

Also, save allows the user to save current progress, and even on tab exit or refresh the current work progress will save. Restart will revert to the original status before any changes were made.


The red boxes in each workjob shows blocks where the workjob does not meet. Also, hovering on a student shows their frees on the top right, where frees are shown black.



