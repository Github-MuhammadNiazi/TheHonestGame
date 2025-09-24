import React, { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { 
  HomeIcon, 
  ChartBarIcon, 
  ClipboardDocumentListIcon, 
  MapIcon, 
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const location = useLocation()

  const navigationItems = [
    { 
      path: '/dashboard', 
      label: t('navigation.dashboard'), 
      icon: HomeIcon 
    },
    { 
      path: '/progress', 
      label: t('navigation.progress'), 
      icon: ChartBarIcon 
    },
    { 
      path: '/task-history', 
      label: t('navigation.taskHistory'), 
      icon: ClipboardDocumentListIcon 
    },
    { 
      path: '/journey', 
      label: t('navigation.myJourney'), 
      icon: MapIcon 
    }
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* User Profile Section */}
      <Link 
        to="/profile" 
        className="flex items-center p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors"
        onClick={onClose}
      >
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
        <div className="ml-4 flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {user?.name || 'User'}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {user?.rank || 'Beginner'}
          </p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon 
                className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} 
              />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-white"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-0">
                  <SidebarContent />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}

export default Sidebar