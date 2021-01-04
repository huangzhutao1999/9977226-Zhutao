import request from "@/utils/request";
 
export async function getBookInstancesList() {
  return request(`/api/bookinstancelist`);
}