import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { motion } from 'framer-motion'

const LanguageSelector = () => {
  const { i18n } = useTranslation()

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language.code)
  }

  return (
    <Listbox value={currentLanguage} onChange={handleLanguageChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-gray-300 hover:ring-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm">
          <span className="flex items-center space-x-2">
            <span className="text-lg">{currentLanguage.flag}</span>
            <span className="block truncate">{currentLanguage.name}</span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-60 w-48 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {languages.map((language) => (
              <Listbox.Option
                key={language.code}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-3 pr-9 ${
                    active ? 'bg-primary-50 text-primary-900' : 'text-gray-900'
                  }`
                }
                value={language}
              >
                {({ selected }) => (
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {language.name}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600">
                        ✓
                      </span>
                    )}
                  </motion.div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export default LanguageSelector