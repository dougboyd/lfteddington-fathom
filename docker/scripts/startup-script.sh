#!/bin/bash --

# This script runs after the database has been initialised. Note that it does not
# run everytime on startup. Once the tables/roles are created, it creates the tl, tl_sa
# roles/database. It then restores the database from the tl.dmp file.
# The extra roles (cloudbos,etc) are garbage and included just to keep the database from erroring out.  
  
export PGPASSWORD=stearmanPT-17
export PGDATABASE=tl
export PGUSER=tl_sa
export PGHOST=localhost
export PGPORT=5432
  
SQLCMD="CREATE ROLE \"${PGUSER}\" LOGIN PASSWORD '${PGPASSWORD}' SUPERUSER VALID UNTIL 'infinity';"
psql -U postgres -d postgres -c "$SQLCMD" 

SQLCMD="CREATE ROLE tl_ro LOGIN PASSWORD '${PGPASSWORD}' SUPERUSER VALID UNTIL 'infinity';"
psql -U postgres -d postgres -c "$SQLCMD" 

SQLCMD="CREATE ROLE cloudbos_sa LOGIN PASSWORD '${PGPASSWORD}' SUPERUSER VALID UNTIL 'infinity';"
psql -U postgres -d postgres -c "$SQLCMD" 
  
createdb -U postgres -O $PGUSER -T template0 ${PGDATABASE}
  
pg_restore -U postgres -d ${PGDATABASE} /tl.dmp