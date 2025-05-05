import { useState, useEffect } from 'react'
import Menu from '@/components/ui/Menu'
import VerticalSingleMenuItem from './VerticalSingleMenuItem'
import VerticalCollapsedMenuItem from './VerticalCollapsedMenuItem'
import { themeConfig } from '@/configs/theme.config'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import useMenuActive from '@/utils/hooks/useMenuActive'
import { useTranslation } from 'react-i18next'
import { Direction, NavMode } from '@/@types/theme'
import type { NavigationTree } from '@/@types/navigation'

export interface VerticalMenuContentProps {
    navMode: NavMode
    collapsed?: boolean
    routeKey: string
    navigationTree?: NavigationTree[]
    userAuthority: string[]
    onMenuItemClick?: () => void
    direction?: Direction
}

const { MenuGroup } = Menu

const VerticalMenuContent = (props: VerticalMenuContentProps) => {
    const {
        navMode = themeConfig.navMode,
        collapsed,
        routeKey,
        navigationTree = [],
        userAuthority = [],
        onMenuItemClick,
        direction = themeConfig.direction,
    } = props

    const { t } = useTranslation()

    const [defaulExpandKey, setDefaulExpandKey] = useState<string[]>([])

    const { activedRoute } = useMenuActive(navigationTree, routeKey)

    useEffect(() => {
        if (defaulExpandKey.length === 0 && activedRoute?.parentKey) {
            setDefaulExpandKey([activedRoute?.parentKey])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activedRoute?.parentKey])

    const handleLinkClick = () => {
        onMenuItemClick?.()
    }

    const getNavItem = (nav: NavigationTree) => {
        // Check if user has required authority or if no authority is required
        if (nav.authority && nav.authority.length > 0) {
            const hasAuthority = userAuthority.some((auth) =>
                nav.authority.includes(auth),
            )
            if (!hasAuthority) {
                return null
            }
        }

        if (nav.subMenu.length === 0 && nav.type === NAV_ITEM_TYPE_ITEM) {
            return (
                <VerticalSingleMenuItem
                    key={nav.key}
                    nav={nav}
                    sideCollapsed={collapsed}
                    userAuthority={userAuthority}
                    direction={direction}
                    onLinkClick={handleLinkClick}
                />
            )
        }

        if (nav.subMenu.length > 0 && nav.type === NAV_ITEM_TYPE_COLLAPSE) {
            // Filter out unauthorized submenu items
            const authorizedSubMenu = nav.subMenu.filter((subNav) => {
                if (!subNav.authority || subNav.authority.length === 0)
                    return true
                return userAuthority.some(
                    (auth) => subNav.authority?.includes(auth),
                )
            })

            if (authorizedSubMenu.length === 0) {
                return null
            }

            return (
                <VerticalCollapsedMenuItem
                    key={nav.key}
                    nav={{ ...nav, subMenu: authorizedSubMenu }}
                    sideCollapsed={collapsed}
                    userAuthority={userAuthority}
                    direction={direction}
                    onLinkClick={onMenuItemClick}
                />
            )
        }

        if (nav.type === NAV_ITEM_TYPE_TITLE) {
            if (nav.subMenu.length > 0) {
                const authorizedSubMenu = nav.subMenu.filter(
                    (subNav) =>
                        !subNav.authority ||
                        userAuthority.some(
                            (auth) => subNav.authority?.includes(auth),
                        ),
                )

                // Don't render menu group if all submenu items are unauthorized
                if (authorizedSubMenu.length === 0) {
                    return null
                }

                return (
                    <MenuGroup
                        key={nav.key}
                        label={t(nav.translateKey) || nav.title}
                    >
                        {authorizedSubMenu.map((subNav) =>
                            subNav.subMenu.length > 0 ? (
                                <VerticalCollapsedMenuItem
                                    key={subNav.key}
                                    nav={subNav}
                                    sideCollapsed={collapsed}
                                    userAuthority={userAuthority}
                                    direction={direction}
                                    onLinkClick={onMenuItemClick}
                                />
                            ) : (
                                <VerticalSingleMenuItem
                                    key={subNav.key}
                                    nav={subNav}
                                    sideCollapsed={collapsed}
                                    userAuthority={userAuthority}
                                    direction={direction}
                                    onLinkClick={onMenuItemClick}
                                />
                            ),
                        )}
                    </MenuGroup>
                )
            }
            return <MenuGroup key={nav.key} label={nav.title} />
        }
        return null
    }

    return (
        <Menu
            className="px-4 pb-4"
            variant={navMode}
            sideCollapsed={collapsed}
            defaultActiveKeys={activedRoute?.key ? [activedRoute.key] : []}
            defaultExpandedKeys={defaulExpandKey}
        >
            {navigationTree.map((nav) => getNavItem(nav))}
        </Menu>
    )
}

export default VerticalMenuContent
