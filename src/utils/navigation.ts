import { router } from "expo-router";


export const openProduct = (id: string) => {
  console.log("Opening openproduct with id:", id);
  router.push({   
    pathname: "/productdetails/[id]", // 👈 must match folder name
    params: { id },
  });
};

export const openCategory = (slug: string) => {
  console.log("Opening category with slug:", slug);
  router.push({
    pathname: "/categorie/[slug]",
    params: { slug },
  });
};

