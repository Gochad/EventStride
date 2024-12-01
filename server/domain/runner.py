class Runner:
    def __init__(self, id, name, age, category, events=None):
        self.id = id
        self.name = name
        self.age = age
        self.category = category
        self.events = events or []

    @staticmethod
    def from_model(model):
        return Runner(
            id=model.id,
            name=model.name,
            age=model.age,
            category=model.category,
            events=[event.id for event in model.events]
        )

    def register_for_race(self, race_event):
        if race_event.id not in self.events:
            self.events.append(race_event.id)

