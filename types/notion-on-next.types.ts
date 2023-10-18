import {
  PageObjectResponse,
  DatePropertyItemObjectResponse,
  RichTextPropertyItemObjectResponse,
  TitlePropertyItemObjectResponse,
  NumberPropertyItemObjectResponse,
  CheckboxPropertyItemObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export interface NotionOnNextPageObjectResponse extends PageObjectResponse {
  slug: string | undefined;
  title: string | undefined;
  coverImage: string | undefined;
}
export interface mediaMapInterface {
  [key: string]: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

export type BlogPageObjectResponse = NotionOnNextPageObjectResponse & {
  properties: {
    Date: DatePropertyItemObjectResponse;
    Description: RichTextPropertyItemObjectResponse;
    Name: TitlePropertyItemObjectResponse;
  };
};
export type EventsPageObjectResponse = NotionOnNextPageObjectResponse & {
  properties: {
    "Extra Details": RichTextPropertyItemObjectResponse;
    Date: DatePropertyItemObjectResponse;
    "Duration (hrs)": NumberPropertyItemObjectResponse;
    Price: NumberPropertyItemObjectResponse;
    stripePriceId: RichTextPropertyItemObjectResponse;
    Id: RichTextPropertyItemObjectResponse;
    Location: RichTextPropertyItemObjectResponse;
    Hide: CheckboxPropertyItemObjectResponse;
    Name: TitlePropertyItemObjectResponse;
  };
};
