import request from "@/utils/request";
 
export async function getGenresList() {
  return request(`/api/genrelist`);
}