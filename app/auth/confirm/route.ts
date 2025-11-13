import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') || '/dashboard';

  if (token_hash && type) {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    if (!error) {
      // Rediriger vers le dashboard après confirmation réussie
      return NextResponse.redirect(new URL(next, request.url));
    }

    console.error('Email confirmation error:', error);
  }

  // En cas d'erreur, rediriger vers la page de login avec un message d'erreur
  return NextResponse.redirect(
    new URL('/auth/login?error=confirmation_failed', request.url)
  );
}
