// @ts-nocheck
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = []

const pages = import.meta.glob('/src/pages/*.vue',{
  eager: true,
  import: "default"
})

for (const path in pages) {
  const name = path.replace("/src/pages/","")
  if (name.startsWith("old")) continue
  routes.push({
    path: (name === 'index' ? '/' : "/" + name).replace(".vue",""),
    name: name.replace(".vue",""),
    component: pages[path]
  });
}

routes.push({
  path: "/",
  name: "index",
  component: () => import("./pages/index.vue"), 
})

// 搜索pages下面文件夹
const pagesDir = import.meta.glob("/src/pages/**/*.vue",{
  eager: true,
  import: "default"
})

const par_children: any = {}

for (const page in pagesDir) {
  const pg = (page.replace("/src/pages/",""));
  if(pg.indexOf("/") > 0) {
    const name = pg.replace(".vue","")
    const pg_splited = name.split("/");

    if (pg_splited[1] == "index" || pg_splited[1].startsWith("old")) continue

    const par = pg_splited[0]
    const child = {
      path: "/" + par + "/" + pg_splited[1],
      name: par + "_" + pg_splited[1],
      component: pagesDir[page]
    }

    if (!par_children[par]) {
      par_children[par] = []
    }
    
    par_children[par].push(child)
  }
}

for (const par in par_children) {
  routes.push({
    path: "/" + par,
    name: par,
    component: pagesDir["/src/pages/" + par + "/index.vue"],
    children: par_children[par]
  });
  
}

// 404
routes.push({
  path: '/:pathMatch(.*)',
  redirect: '/404'
})

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});


export default router;