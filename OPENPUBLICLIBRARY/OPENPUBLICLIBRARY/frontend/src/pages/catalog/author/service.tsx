import request from "@/utils/request";
 
export async function getAuthorsList() {
  return request(`/api/authorlist`);
}