class UnitOfWork:
    def __init__(self, session):
        self.session = session
        self._rollback = False

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self.session.rollback()
            self._rollback = True
        elif not self._rollback:
            self.session.commit()

    def mark_rollback(self):
        self._rollback = True
