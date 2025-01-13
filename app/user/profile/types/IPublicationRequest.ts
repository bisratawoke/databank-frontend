export type PublicationRequest = {
  _id: string;
  paymentRequired: boolean;
  category: string[];
  preferredDataFormat: string;
  purposeForResearch: string;
  dateImportance: string;
  author: string;
  status: string;
  adminUnits: string;
  attachments: string[];
  __v?: number;
  department?: string;
};
