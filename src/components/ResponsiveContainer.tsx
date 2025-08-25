/*
 * Learning-Agent - AI4Good for Education
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: "Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives."
 */

import { ReactNode } from 'react'
import { useDeviceType } from '../hooks/use-mobile'

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  mobileClassName?: string
  tabletClassName?: string
  desktopClassName?: string
}

export function ResponsiveContainer({
  children,
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = ''
}: ResponsiveContainerProps) {
  const deviceType = useDeviceType()

  const getDeviceSpecificClass = () => {
    switch (deviceType) {
      case 'mobile':
        return mobileClassName
      case 'tablet':
        return tabletClassName
      case 'desktop':
        return desktopClassName
      default:
        return ''
    }
  }

  return (
    <div className={`${className} ${getDeviceSpecificClass()}`}>
      {children}
    </div>
  )
}

interface ResponsiveGridProps {
  children: ReactNode
  className?: string
  mobileColumns?: number
  tabletColumns?: number
  desktopColumns?: number
  gap?: 'sm' | 'md' | 'lg' | 'xl'
}

export function ResponsiveGrid({
  children,
  className = '',
  mobileColumns = 1,
  tabletColumns = 2,
  desktopColumns = 3,
  gap = 'md'
}: ResponsiveGridProps) {
  const deviceType = useDeviceType()

  const getGridColumns = () => {
    switch (deviceType) {
      case 'mobile':
        return `grid-cols-${mobileColumns}`
      case 'tablet':
        return `grid-cols-${tabletColumns}`
      case 'desktop':
        return `grid-cols-${desktopColumns}`
      default:
        return `grid-cols-1 sm:grid-cols-${tabletColumns} lg:grid-cols-${desktopColumns}`
    }
  }

  const getGapClass = () => {
    const gapMap = {
      sm: 'gap-2 sm:gap-3 lg:gap-4',
      md: 'gap-3 sm:gap-4 lg:gap-6',
      lg: 'gap-4 sm:gap-6 lg:gap-8',
      xl: 'gap-6 sm:gap-8 lg:gap-10'
    }
    return gapMap[gap]
  }

  return (
    <div className={`grid ${getGridColumns()} ${getGapClass()} ${className}`}>
      {children}
    </div>
  )
}

interface ResponsiveSpacingProps {
  children: ReactNode
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function ResponsiveSpacing({
  children,
  spacing = 'md',
  className = ''
}: ResponsiveSpacingProps) {
  const getSpacingClass = () => {
    const spacingMap = {
      sm: 'space-y-2 sm:space-y-3 lg:space-y-4',
      md: 'space-y-3 sm:space-y-4 lg:space-y-6',
      lg: 'space-y-4 sm:space-y-6 lg:space-y-8',
      xl: 'space-y-6 sm:space-y-8 lg:space-y-10'
    }
    return spacingMap[spacing]
  }

  return (
    <div className={`${getSpacingClass()} ${className}`}>
      {children}
    </div>
  )
}
