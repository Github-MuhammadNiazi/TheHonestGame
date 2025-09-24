import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { Menu, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { 
  Bars3Icon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  WifiIcon,
  SignalSlashIcon
} from '@heroicons/react/24/outline'
import LanguageSelector from './LanguageSelector'

const Header = ({ onMenuClick }) => {
  const { user, logout, isOnline } = useAuth()
  const { t } = useTranslation()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Left side */}
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
              onClick={onMenuClick}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <motion.h1 
              className="ml-4 lg:ml-0 text-2xl font-bold text-gray-900"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {t('app.name')}
            </motion.h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Online/Offline Status */}
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              {isOnline ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <WifiIcon className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {t('common.online')}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-red-600">
                  <SignalSlashIcon className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {t('common.offline')}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Language Selector */}
            <LanguageSelector />

            {/* User Menu */}
            <Menu as="div" className="relative">
              <div>
                <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {user?.name || 'User'}
                  </span>
                </Menu.Button>
              </div>
              
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Panel className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                        {t('auth.logout')}
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Panel>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header