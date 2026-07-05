'use client'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScraperKeyId, useApiKeys } from '@/hooks/useApiKeys'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

export const SettingsPage = () => {
    const t = useTranslations()

    const { apiKeys, setSgdbKey } = useApiKeys()
    const sgdbKey = apiKeys?.[ScraperKeyId.SteamGridDb]

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>('')

    const handleButtonSubmit = useCallback(async () => {
        if (isEditing) {
            setSgdbKey(inputValue)
            setIsEditing(false)
        } else {
            setInputValue(sgdbKey ?? '')
            setIsEditing(true)
        }
    }, [isEditing, setSgdbKey, inputValue, sgdbKey])

    return (
        <div className='flex flex-col gap-4 p-4'>
            <h1 className='text-3xl font-bold'>Scrappers</h1>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('settings.sgdb.title')}</CardTitle>
                        <CardDescription>
                            {t('settings.sgdb.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className='flex flex-col gap-2'>
                                <Label htmlFor='email'>
                                    {t('general.apiKey')}
                                </Label>
                                <Input
                                    id='apiKey'
                                    type='text'
                                    required
                                    value={
                                        isEditing ? inputValue : (sgdbKey ?? '')
                                    }
                                    disabled={!isEditing}
                                    onChange={(e) =>
                                        setInputValue(e.target.value)
                                    }
                                />
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className='flex items-center justify-between gap-2'>
                        {isEditing && (
                            <Button
                                variant='outline'
                                id='cancelEdit'
                                className='flex-1 cursor-pointer'
                                onClick={() => setIsEditing(false)}
                            >
                                {t('general.actions.cancel')}
                            </Button>
                        )}
                        <Button
                            className='flex-1 cursor-pointer'
                            onClick={handleButtonSubmit}
                        >
                            {isEditing
                                ? t('general.actions.save')
                                : t('general.actions.edit')}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default SettingsPage
