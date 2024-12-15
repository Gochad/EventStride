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
        return {
            "name": model.name,
            "date": model.date.isoformat() if model.date else None,
            "distance": model.distance,
            "location": {
                "id": model.location.id,
                "city": model.location.city,
                "country": model.location.country
            } if model.location else None,
            "runners": [
                {
                    "id": runner.id,
                    "name": runner.name,
                    "age": runner.age,
                    "category": runner.category
                }
                for runner in model.runners
            ] 
        }


    def add_runner(self, runner):
        if runner.id not in self.runners:
            self.runners.append(runner.id)
