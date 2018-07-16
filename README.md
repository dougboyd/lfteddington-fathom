# lfteddington-fathom
An import structure from a LegalFirst database to Fathom for Teddington Legal

# to run
Open the ./config/last_run.json and adjust the date to the current month (or period you wish to run)
Open a terminal window and, from the top level, run
docker-compose up --build

After the JSON object appears on the terminal window, an excel file is generated to ./backend/output/finacial_import.xlsx

# to upload
Open up fathomhq.com
username - nicole@tt.legal
password - 410Elizabth