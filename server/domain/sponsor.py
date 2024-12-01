class Sponsor:
    def __init__(self, id, name, logo, sponsor_type, events=None):
        self.id = id
        self.name = name
        self.logo = logo
        self.sponsor_type = sponsor_type
        self.events = events or []

    @staticmethod
    def from_model(model):
        return Sponsor(
            id=model.id,
            name=model.name,
            logo=model.logo,
            sponsor_type=model.type,
            events=[event.id for event in model.race_events]
        )

    def add_event(self, event_id):
        if event_id not in self.events:
            self.events.append(event_id)
