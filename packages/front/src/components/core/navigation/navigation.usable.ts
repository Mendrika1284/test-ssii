import { ROUTE_NAMES } from "@/router/routes";
import { computed, ComputedRef } from "@vue/composition-api";

export type NAVIGATION_MENU = keyof Pick<typeof ROUTE_NAMES, "Examples">;

type NavigationItem = {
  name: string;
  routeName?: string;
  new?: boolean;
  icon: string;
};
type NavigationItemChildren = Omit<NavigationItem, "icon"> & {
  icon?: string;
};
export type NavigationItems = (NavigationItem & {
  children?: NavigationItemChildren[];
})[];

// Secure the navigation titles with the route names
// And inject parents to aggregate some of them

export const useNavigationItems = () => {
  const NAVIGATION_TITLES: ComputedRef<{
    [key in NAVIGATION_MENU]: string;
  }> = computed(() => ({
    Examples: "Exemple",
  }));

  const navigationItems: ComputedRef<NavigationItems> = computed(() => {
    const navigationItems: NavigationItems = [
      {
        name: NAVIGATION_TITLES.value.Examples,
        icon: "mdi-home-outline",
        routeName: ROUTE_NAMES.Examples,
      },
    ];

    return navigationItems
      .filter((item) => item !== undefined)
      .map((item) => {
        if (item?.children) {
          item.children = item.children.filter(
            (children) => children !== undefined
          );
          return item;
        }
        return item;
      }) as NavigationItems;
  });

  return {
    NAVIGATION_TITLES,
    // Remove undefined items
    navigationItems,
  };
};
