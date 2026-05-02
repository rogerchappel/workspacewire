export const SERVICES = Object.freeze({
  gmail: {
    displayName: 'Gmail',
    fixture: 'gmail.json',
    operations: {
      search: { method: 'GET', path: '/gmail/v1/users/me/messages', scopes: ['gmail.readonly'], mutates: false, required: ['query'] },
      draft: { method: 'POST', path: '/gmail/v1/users/me/drafts', scopes: ['gmail.compose'], mutates: false, disabledReason: 'Draft creation is intentionally planner-only in v1.' },
      send: { method: 'POST', path: '/gmail/v1/users/me/messages/send', scopes: ['gmail.send'], mutates: true, disabledReason: 'Sending email is outside v1 safety boundaries.' }
    }
  },
  calendar: {
    displayName: 'Calendar',
    fixture: 'calendar.json',
    operations: {
      list: { method: 'GET', path: '/calendar/v3/calendars/primary/events', scopes: ['calendar.events.readonly'], mutates: false },
      create: { method: 'POST', path: '/calendar/v3/calendars/primary/events', scopes: ['calendar.events'], mutates: true, disabledReason: 'Calendar mutations are not executed by workspacewire.' }
    }
  },
  drive: {
    displayName: 'Drive',
    fixture: 'drive.json',
    operations: {
      find: { method: 'GET', path: '/drive/v3/files', scopes: ['drive.metadata.readonly'], mutates: false },
      export: { method: 'GET', path: '/drive/v3/files/{fileId}/export', scopes: ['drive.readonly'], mutates: false, required: ['fileId'] },
      upload: { method: 'POST', path: '/upload/drive/v3/files', scopes: ['drive.file'], mutates: true, disabledReason: 'Uploads are out of scope for the fixture-backed planner.' }
    }
  },
  contacts: {
    displayName: 'Contacts',
    fixture: 'contacts.json',
    operations: {
      lookup: { method: 'GET', path: '/people/v1/people:searchContacts', scopes: ['contacts.readonly'], mutates: false, required: ['query'] }
    }
  }
});

export const SCOPE_DETAILS = Object.freeze({
  'gmail.readonly': { url: 'https://www.googleapis.com/auth/gmail.readonly', risk: 'read-only', reason: 'Read message metadata/content for planning inbox search.' },
  'gmail.compose': { url: 'https://www.googleapis.com/auth/gmail.compose', risk: 'draft-write', reason: 'Would allow draft creation; explained but not executed.' },
  'gmail.send': { url: 'https://www.googleapis.com/auth/gmail.send', risk: 'send-mail', reason: 'Would send messages; blocked by v1 policy.' },
  'calendar.events.readonly': { url: 'https://www.googleapis.com/auth/calendar.events.readonly', risk: 'read-only', reason: 'Read event details for scheduling plans.' },
  'calendar.events': { url: 'https://www.googleapis.com/auth/calendar.events', risk: 'calendar-write', reason: 'Would change events; blocked by v1 policy.' },
  'drive.metadata.readonly': { url: 'https://www.googleapis.com/auth/drive.metadata.readonly', risk: 'metadata-only', reason: 'Find files without reading document contents.' },
  'drive.readonly': { url: 'https://www.googleapis.com/auth/drive.readonly', risk: 'content-read', reason: 'Read/export selected Drive content in a future adapter.' },
  'drive.file': { url: 'https://www.googleapis.com/auth/drive.file', risk: 'file-write', reason: 'Would create/update app-created files; blocked by v1 policy.' },
  'contacts.readonly': { url: 'https://www.googleapis.com/auth/contacts.readonly', risk: 'read-only', reason: 'Resolve people from local fixtures or future read-only contact search.' }
});

export function getOperation(service, operation) {
  const serviceSpec = SERVICES[service];
  if (!serviceSpec) throw new Error(`Unknown service "${service}". Try one of: ${Object.keys(SERVICES).join(', ')}`);
  const opSpec = serviceSpec.operations[operation];
  if (!opSpec) throw new Error(`Unknown ${service} operation "${operation}". Try one of: ${Object.keys(serviceSpec.operations).join(', ')}`);
  return { serviceSpec, opSpec };
}
