#!/bin/bash --

#  
#  
#  SCRIPT=$(basename $0)
#  
#  # Restore an instance database from a specific backup file
#  # Currently only works on a VM
#  # Designed to be called from other scripts
#  
#  ###
#  usage() {
#  cat <<EOF
#  usage:
#    ${SCRIPT} -i <instance> -b <backup>
#  
#    <instance> - name of client to recover
#    <backup>   - full path to backup file
#  EOF
#  exit 1
#  }
#  
#  ###
#  die() {
#  echo
#  echo "${SCRIPT}:" "$@"
#  usage
#  exit 1
#  }
#  
#  pause() {
#  while echo "$@";echo "Press y to proceed or n to quit";read Reply;do
#  [ "y" = "$Reply" ] && break
#  [ "n" = "$Reply" ] && exit 1
#  done
#  }
#  
#  
#  recoverInstanceDB() {
#  
#  echo "Recovering DB for ${INSTANCE} from ${BACKUP_FILE}"
#  
export PGPASSWORD=stearmanPT-17
export PGDATABASE=tl
export PGUSER=tl_sa
export PGHOST=localhost
export PGPORT=5432
#  export PGOPTIONS='--client-min-messages=error'
#  
SQLCMD="CREATE ROLE \"${PGUSER}\" LOGIN PASSWORD '${PGPASSWORD}' SUPERUSER VALID UNTIL 'infinity';"
psql -U postgres -d postgres -c "$SQLCMD" # > /dev/null 2>&1

SQLCMD="CREATE ROLE tl_ro LOGIN PASSWORD '${PGPASSWORD}' SUPERUSER VALID UNTIL 'infinity';"
psql -U postgres -d postgres -c "$SQLCMD" # > /dev/null 2>&1

SQLCMD="CREATE ROLE cloudbos_sa LOGIN PASSWORD '${PGPASSWORD}' SUPERUSER VALID UNTIL 'infinity';"
psql -U postgres -d postgres -c "$SQLCMD" # > /dev/null 2>&1
  
#  SQLCMD="update pg_database set datallowconn = 'false' where datname = '${PGDATABASE}';"
#  psql -U postgres -d postgres -c "$SQLCMD"
#  
#  SQLCMD="SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${PGDATABASE}';"
#  psql -U postgres -d postgres -c "$SQLCMD"  1>/dev/null 2>&1
#  
#  dropdb ${PGDATABASE}
#  [ $? -eq 0 ] || exit 1
#  
createdb -U postgres -O $PGUSER -T template0 ${PGDATABASE}
#  [ $? -eq 0 ] || exit 1
#  
pg_restore -U postgres -d ${PGDATABASE} /tl.dmp
#  [ $? -eq 0 ] || exit 1
#  
#  SQLCMD="update pg_database set datallowconn = 'true' where datname = '${PGDATABASE}';"
#  psql -U postgres -d postgres -c "$SQLCMD"
#  
#  export PGOPTIONS='--client_min_messages=ERROR'
#  psql -q -c "ANALYZE;"
#  
#  }
#  
#  
#  #
#  # Main 
#  #
#  
#  #Parse arguments
#  unset INSTANCE BACKUP_FILE
#  
#  while [ $# -ne 0 ];do
#    case $1 in
#      -i)	      export INSTANCE=$2;shift;;
#      -b)    	  export BACKUP_FILE=$2;shift;;
#    esac
#    shift
#  done
#   
#  #Validate arguments
#  [ -z "${INSTANCE}" ]          && die "-i <instance> required"
#  [ -z "${BACKUP_FILE}" ]       && die "-b <backup> required"
#  [ -f "${BACKUP_FILE}" ]       || die "<backup> does not exist"
#  
#  recoverInstanceDB
#  