import { supabase } from '@/lib/supabase'

export function useUpload() {
  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${crypto.randomUUID()}.${fileExt}`

    const { error } = await supabase.storage
      .from('couture-uploads')
      .upload(fileName, file)

    if (error) {
      console.error('Erreur upload:', error.message)
      return null
    }

    const { data } = supabase.storage
      .from('couture-uploads')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  return { uploadFile }
}