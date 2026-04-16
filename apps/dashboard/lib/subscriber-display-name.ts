const FIRST = [
  'Jordan',
  'Riley',
  'Casey',
  'Quinn',
  'Avery',
  'Morgan',
  'Reese',
  'Skyler',
  'Rowan',
  'Emerson',
  'Hayden',
  'Finley',
  'Parker',
  'Dakota',
  'River',
  'Sage',
  'Phoenix',
  'Charlie',
  'Blake',
  'Logan',
];

const LAST = [
  'Chen',
  'Rivera',
  'Okonkwo',
  'Patel',
  'Nakamura',
  'Silva',
  'Kowalski',
  'Hassan',
  'Okafor',
  'Fernández',
  'Johansson',
  'Tanaka',
  'Olsen',
  'Nguyen',
  'Khan',
  'Berg',
  'Cohen',
  'Murphy',
  'Santos',
  'Yamamoto',
];

export type NameFields = {
  firstName?: string | null;
  lastName?: string | null;
};

function hashId(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function syntheticFullName(id: string): string {
  const key = id.length > 0 ? id : 'subscriber';
  const h = hashId(key);
  return `${FIRST[h % FIRST.length]} ${LAST[(h >> 8) % LAST.length]}`;
}

function syntheticFirstFromId(id: string): string {
  const h = hashId(`${id}:first`);
  return FIRST[h % FIRST.length];
}

function syntheticLastFromId(id: string): string {
  const h = hashId(`${id}:last`);
  return LAST[h % LAST.length];
}

/**
 * Full display name: prefers API first/last when both meaningful; otherwise fills gaps or uses a stable synthetic pair.
 */
export function subscriberDisplayName(subscriberId: string, user?: NameFields | null): string {
  const id =
    typeof subscriberId === 'string' && subscriberId.trim().length > 0 ? subscriberId.trim() : 'subscriber';
  const first = user?.firstName?.trim() ?? '';
  const last = user?.lastName?.trim() ?? '';

  if (first && last) {
    return `${first} ${last}`;
  }
  if (first) {
    return `${first} ${syntheticLastFromId(id)}`;
  }
  if (last) {
    return `${syntheticFirstFromId(id)} ${last}`;
  }
  return syntheticFullName(id);
}
