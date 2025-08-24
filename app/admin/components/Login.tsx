'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import styles from './Login.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError(error.message)
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.titleSection}>
          <Link href="/">
            <h1>Zarab Collections</h1>
          </Link>
          <h2 className={styles.subtitle}>
            Seller Login
          </h2>
          <p className={styles.description}>
            Access your admin dashboard
          </p>
        </div>
        <form className={styles.form} onSubmit={handleLogin}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          <div className={styles.inputGroup}>
            <div>
              <label htmlFor="email" className={styles.hiddenLabel}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`${styles.inputField} ${styles.inputTop}`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className={styles.hiddenLabel}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`${styles.inputField} ${styles.inputBottom}`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className={styles.backLink}>
            <Link href="/">
              ← Back to website
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}