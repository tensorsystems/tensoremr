export type PaginationInput = {
    page: number;
    size: number;
  };

  export type ITemplateFormInput = {
    id: string;
    title: string;
    inputs: {
      id: string;
      type: string;
      children: {
        id: string;
        name: string;
        type: string;
      }[];
    }[];
  }