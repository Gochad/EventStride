class RaceEvent:
    def __init__(self, id, name, date, distance, location, runners=None):
        self.id = id
        self.name = name
        self.date = date
        self.distance = distance
        self.location = location
        self.runners = runners or []

    @staticmethod
    def from_model(model):
        return RaceEvent(
            id=model.id,
            name=model.name,
            date=model.date,
            distance=model.distance,
            location=model.location.id if model.location else None,
            runners=[runner.id for runner in model.runners]
        )

    def add_runner(self, runner):
        if runner.id not in self.runners:
            self.runners.append(runner.id)
