import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

class DatabaseService {
  // Authentication Methods
  async authenticate() {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Incorrect email or password')
        }
        throw error
      }

      // Check if user is approved
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('isApproved')
        .eq('id', data.user.id)
        .single()

      if (userError) throw userError

      if (!userData.isApproved) {
        await supabase.auth.signOut()
        throw new Error('Your account is not active, please reach out to support at support@honesthero.com')
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async signup(email, password, userData = {}) {
    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single()

      if (existingUser) {
        throw new Error('Email account already exists')
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) throw error

      return { 
        success: true, 
        message: 'Your account has been created and awaiting approval. Please send an email to support@honesthero.com for any queries' 
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return { success: true, message: 'Password reset email sent' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // User Methods
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error

      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (userError) throw userError
        return { success: true, data: userData }
      }

      return { success: true, data: null }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Task Methods
  async getCurrentTask(userId) {
    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .select(`
          *,
          tasks (
            id,
            name,
            description,
            arc_id
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async markTaskComplete(userTaskId) {
    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', userTaskId)
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Leaderboard Methods
  async getLeaderboard(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name, rank, created_at')
        .eq('isApproved', true)
        .order('created_at', { ascending: true })
        .limit(limit)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Progress Methods
  async getUserProgress(userId) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Task History Methods
  async getTaskHistory(userId) {
    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .select(`
          *,
          tasks (
            id,
            name,
            description,
            story_part,
            arc_id
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Arc Methods
  async getUnlockedArcs(userId) {
    try {
      const { data, error } = await supabase
        .from('user_arcs')
        .select(`
          *,
          arcs (
            id,
            name,
            description,
            stories (
              id,
              title,
              content,
              order_index
            )
          )
        `)
        .eq('user_id', userId)
        .eq('is_unlocked', true)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export const dbService = new DatabaseService()
