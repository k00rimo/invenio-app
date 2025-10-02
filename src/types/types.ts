export type InvenioRecord = {
  id: string;
  created: string; // ISO datetime
  updated: string; // ISO datetime
  links: InvenioRecordLinks;
  revision_id: number;
  parent: {
    id: string;
    access: {
      owned_by?: { user?: string };
      settings?: {
        allow_user_requests: boolean;
        allow_guest_requests: boolean;
        accept_conditions_text: string | null;
        secret_link_expiration: number;
      };
    };
    communities: Record<string, unknown>;
    pids?: InvenioPIDs;
  };
  versions: { is_latest: boolean; index: number };
  is_published: boolean;
  is_draft: boolean;
  pids?: InvenioPIDs;
  metadata: InvenioMetadata;
  custom_fields: Record<string, unknown>;
  access: {
    record: "public" | "restricted" | string;
    files: "public" | "restricted" | string;
    embargo: { active: boolean; reason: string | null };
    status: "open" | "embargoed" | "restricted" | string;
  };
  files: InvenioFiles;
  media_files: InvenioMediaFiles;
  status: "published" | "draft" | string;
  deletion_status: { is_deleted: boolean; status: string };
  stats: {
    this_version: InvenioStats;
    all_versions: InvenioStats;
  };
};

export type InvenioRecordLinks = {
  self: string;
  self_html: string;
  preview_html?: string;
  doi?: string;
  self_doi?: string;
  self_doi_html?: string;
  reserve_doi?: string;
  parent?: string;
  parent_html?: string;
  parent_doi?: string;
  parent_doi_html?: string;
  self_iiif_manifest?: string;
  self_iiif_sequence?: string;
  files?: string;
  media_files?: string;
  thumbnails?: Record<string, string>; // sizes to URL
  archive?: string;
  archive_media?: string;
  latest?: string;
  latest_html?: string;
  versions?: string;
  draft?: string;
  access_links?: string;
  access_grants?: string;
  access_users?: string;
  access_groups?: string;
  access_request?: string;
  access?: string;
  communities?: string;
  "communities-suggestions"?: string;
  requests?: string;
};

export type InvenioPIDs = {
  [scheme: string]: {
    identifier: string;
    provider: string;
    client?: string;
  };
};

export type InvenioMetadata = {
  resource_type: {
    id: string;
    title: Record<string, string>; // localized titles
  };
  creators: Array<{
    person_or_org: {
      type: "personal" | "organizational" | string;
      name: string;
      given_name?: string;
      family_name?: string;
    };
  }>;
  title: string;
  publisher?: string;
  publication_date?: string; // YYYY-MM-DD
  subjects?: Array<{ subject: string }>;
  dates?: Array<{
    date: string; // ISO or YYYY-MM-DD
    type: { id: string; title: Record<string, string> };
  }>;
  identifiers?: Array<{
    identifier: string;
    scheme: string;
  }>;
  description?: string;
};

export type InvenioFiles = {
  enabled: boolean;
  order: string[];
  count: number;
  total_bytes: number;
  entries: Record<string, InvenioFileEntry>;
};

export type InvenioFileEntry = {
  id: string;
  checksum: string; // e.g., md5:...
  ext?: string | null;
  size: number;
  mimetype?: string;
  storage_class?: string;
  key: string;
  metadata: unknown | null;
  access: { hidden: boolean };
  links: {
    self: string;
    content: string;
    iiif_canvas?: string;
    iiif_base?: string;
    iiif_info?: string;
    iiif_api?: string;
  };
};

export type InvenioMediaFiles = {
  enabled: boolean;
  order: string[];
  count: number;
  total_bytes: number;
  entries: Record<string, never>;
};

export type InvenioStats = {
  views: number;
  unique_views: number;
  downloads: number;
  unique_downloads: number;
  data_volume: number; // bytes or unitless per API
};

// --- Search response (list/aggregated) types ---

// A single aggregation bucket (with optional nested buckets via `inner`).
export type InvenioAggregationBucket = {
  key: string;
  doc_count: number;
  label: string;
  is_selected: boolean;
  inner?: {
    buckets: InvenioAggregationBucket[];
  };
};

// A generic aggregation with buckets and a human-friendly label.
export type InvenioAggregation = {
  buckets: InvenioAggregationBucket[];
  label: string;
};

// Convenience: links returned by list endpoints (pagination, etc.).
export type InvenioListLinks = {
  self: string;
  next?: string;
  prev?: string;
  first?: string;
  last?: string;
};

// The hits wrapper used by search endpoints. Parameterized by the record type.
export type InvenioSearchHits<TItem> = {
  hits: TItem[];
  total: number;
};

// The complete search response returned by /records (and similar endpoints).
export type InvenioSearchResponse<TItem> = {
  hits: InvenioSearchHits<TItem>;
  aggregations?: Record<string, InvenioAggregation>;
  sortBy?: SortOption | string;
  links?: InvenioListLinks;
};

export const sortOptions = {
  bestMatch: "bestmatch",
  newest: "newest",
  oldest: "oldest",
  updatedDesc: "updated-desc",
  updatedAsc: "updated-asc",
  version: "version",
  mostViewed: "mostviewed",
  mostDownloaded: "mostdownloaded",
} as const;

export type SortOption = (typeof sortOptions)[keyof typeof sortOptions];

export type SearchRecordsParams = {
  query?: string;
  sort?: SortOption;
  page?: number;
  size?: number;
  allVersions?: boolean;
};
