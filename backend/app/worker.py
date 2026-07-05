import time

from app.db.database import SessionLocal
from app.services.worker_service import WorkerService


POLL_INTERVAL_SECONDS = 2


def main():
    print("=" * 60)
    print("Hazel AI Worker Started")
    print("=" * 60)

    while True:

        db = SessionLocal()

        try:
            processed = WorkerService.process_next_job(db)

            if processed:
                print("Processed one workflow job.")
            else:
                print("No queued jobs.")

        except Exception as ex:
            print(f"Worker Error: {ex}")

        finally:
            db.close()

        time.sleep(POLL_INTERVAL_SECONDS)


if __name__ == "__main__":
    main()