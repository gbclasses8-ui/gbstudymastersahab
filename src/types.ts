export interface Course {
  id: string;
  title: string;
  course_sp?: string;
  mrp?: string;
  validity?: string;
  cover_image?: string;
  desc_header_image?: string;
  image_icon?: string;
  thumbnail?: string;
  extra_json?: {
    is_live?: string;
    is_new?: string;
    is_trending?: string;
  };
  segment_information?: string;
  description?: string;
}

export interface BatchItem {
  id: string;
  title: string;
  is_live?: string;
  segment_information?: string;
  desc_header_image?: string;
  cover_image?: string;
  is_locked?: string;
  cat_type?: string;
  validity?: string;
}

export interface TopicItem {
  id: string;
  topic_id?: string;
  title: string;
  count?: string | number;
  image_icon?: string;
}

export interface SubjectItem {
  id: string;
  title: string;
  count?: string | number;
  image_icon?: string;
  list?: TopicItem[];
}

export interface TileMeta {
  list?: SubjectItem[];
  description?: {
    data?: string;
  };
}

export interface BatchTile {
  id: string | number;
  title?: string;
  type: string; // 'content' | 'video' | 'pdf' | 'test' | 'overview'
  revert_api?: string;
  meta?: TileMeta;
}

export interface BatchDetail {
  course_detail?: {
    id: string;
    title: string;
    description?: string;
    cover_image?: string;
    desc_header_image?: string;
    validity?: string;
    course_sp?: string;
    mrp?: string;
  };
  tiles?: BatchTile[];
}

export interface ContentItem {
  id: string;
  vdc_id?: string;
  title: string;
  file_url?: string;
  file_type?: string; // "1" for PDF, "3" for video
  duration?: string;
  thumbnail?: string;
  test_series_name?: string;
  test_code?: string;
  total_questions?: string | number;
  // Breadcrumb metadata for global search
  batchId?: string;
  batchTitle?: string;
  subjectTitle?: string;
  topicTitle?: string;
  category?: 'video' | 'note' | 'test';
}

export interface CatalogData {
  courses: Course[];
  batches: BatchItem[];
  batch_details: Record<string, BatchDetail>;
  master_items: Record<string, ContentItem[]>;
}
