import {
  PageObjectResponse,
  RichTextPropertyItemObjectResponse,
  DatePropertyItemObjectResponse,
  MultiSelectPropertyItemObjectResponse,
  TitlePropertyItemObjectResponse,
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
    Description: RichTextPropertyItemObjectResponse;
    Date: DatePropertyItemObjectResponse;
    Tags: MultiSelectPropertyItemObjectResponse;
    Name: TitlePropertyItemObjectResponse;
  };
};
