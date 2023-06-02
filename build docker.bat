G:

cd G:\HCMUTE\TLCN\temp fe\temp-choice-your-calendar

docker build -t timechoice2 .

docker run -p 4200:80 -p 443:443 --name timechoice timechoice2:latest