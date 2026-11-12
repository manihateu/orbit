import { events } from "@/data/events";
import { internships } from "@/data/internships";
import { resumes } from "@/data/resumes";
import { vacancies } from "@/data/vacancies";
import type { EventItem, Internship, Resume, Vacancy } from "@/data/types";

const wait = (ms = 320) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function fetchVacancies(): Promise<Vacancy[]> {
  await wait(380);
  return vacancies;
}

export async function fetchResumes(): Promise<Resume[]> {
  await wait(420);
  return resumes;
}

export async function fetchInternships(): Promise<Internship[]> {
  await wait(360);
  return internships;
}

export async function fetchEvents(): Promise<EventItem[]> {
  await wait(340);
  return events;
}
