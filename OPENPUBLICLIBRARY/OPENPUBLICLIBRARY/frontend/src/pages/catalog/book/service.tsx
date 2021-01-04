import request from "@/utils/request";
 
export async function getBooksList() {
  return request(`/api/booklist`);
}
 
export async function queryUser2(params: any) {
  return request(`/server/api//test/user?${params}`, {
    method: "POST"
  });
}