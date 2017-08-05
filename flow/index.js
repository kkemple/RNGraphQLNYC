// @flow

type CalendarEventPayload = {
  day: number,
  month: number,
  year: number,
  timestamp: string,
  dateString: string,
};

type AgendaEvent = {
  type: string,
  title: string,
  description: string,
  link: string,
};
