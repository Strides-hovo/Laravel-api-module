export type PageId =
    | 'instructions'
    | 'requirements'
    | 'installation'
    | 'commands'
    | 'create-module'
    | 'transformer'
    | 'migrations'
    | 'mockapi-editor'
    | 'issues'
    | 'discussions'
    | 'github';

export interface NavGroup {
  id: string;
  label: string;
  icon: string;
  items: {
    id: PageId;
    label: string;
    badge?: string;
  }[];
}

export interface SearchResult {
  id: string;
  pageId: PageId;
  title: string;
  category: string;
  description: string;
  codeSnippet?: string;
}

export interface EnvVariable {
  key: string;
  value: string;
  defaultValue: string;
  description: string;
  type: 'boolean' | 'string';
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'controller' | 'model' | 'migration' | 'route' | 'action' | 'config' | 'provider' | 'seeder' | 'repository' | 'transformer' | 'request' | 'http';
}
