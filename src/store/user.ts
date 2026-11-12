import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Vacancy, EventItem, ActivityEntry, Application } from "@/data/types";
import { seedActivities, seedApplications, resumeDraftSeed, type ResumeDraft } from "@/data/profile";

interface UserState {
  favorites: string[];
  applications: Application[];
  registrations: string[];
  activities: ActivityEntry[];
  resume: ResumeDraft;
  verified: boolean;
  toggleFavorite: (id: string) => boolean;
  isFavorite: (id: string) => boolean;
  hasApplied: (id: string) => boolean;
  apply: (vacancy: Vacancy, coverLetter?: string) => void;
  registerEvent: (event: EventItem) => boolean;
  isRegistered: (id: string) => boolean;
  addCourseActivity: (title: string, provider: string, hours: number) => void;
  updateResume: (patch: Partial<ResumeDraft>) => void;
  setVerified: (value: boolean) => void;
  reset: () => void;
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useUser = create<UserState>()(
  persist(
    (set, get) => ({
      favorites: ["frontend-react-kaspiytech", "ux-ui-kaspiytech", "drone-operator-greencity"],
      applications: seedApplications,
      registrations: ["kaspiytech-open-day"],
      activities: seedActivities,
      resume: resumeDraftSeed,
      verified: true,

      toggleFavorite: (id) => {
        const active = get().favorites.includes(id);
        set({
          favorites: active
            ? get().favorites.filter((item) => item !== id)
            : [id, ...get().favorites],
        });
        return !active;
      },
      isFavorite: (id) => get().favorites.includes(id),
      hasApplied: (id) => get().applications.some((item) => item.vacancyId === id),

      apply: (vacancy) => {
        if (get().hasApplied(vacancy.id)) return;
        set({
          applications: [
            {
              id: uid(),
              vacancyId: vacancy.id,
              appliedAt: new Date().toISOString().slice(0, 10),
              status: "sent",
            },
            ...get().applications,
          ],
        });
      },

      registerEvent: (event) => {
        if (get().registrations.includes(event.id)) return false;
        set({
          registrations: [event.id, ...get().registrations],
          activities: [
            {
              id: uid(),
              title: event.title,
              kind: event.type,
              date: event.date,
              organizer: event.organizer,
              hours: event.hours,
              source: "event",
            },
            ...get().activities,
          ],
        });
        return true;
      },
      isRegistered: (id) => get().registrations.includes(id),

      addCourseActivity: (title, provider, hours) => {
        set({
          activities: [
            {
              id: uid(),
              title,
              kind: "Курс",
              date: new Date().toISOString().slice(0, 10),
              organizer: provider,
              hours,
              source: "course",
            },
            ...get().activities,
          ],
        });
      },

      updateResume: (patch) => set({ resume: { ...get().resume, ...patch } }),
      setVerified: (value) => set({ verified: value }),

      reset: () =>
        set({
          favorites: ["frontend-react-kaspiytech", "ux-ui-kaspiytech", "drone-operator-greencity"],
          applications: seedApplications,
          registrations: ["kaspiytech-open-day"],
          activities: seedActivities,
          resume: resumeDraftSeed,
          verified: true,
        }),
    }),
    { name: "orbita-user", version: 1 },
  ),
);
