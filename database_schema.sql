-- ==========================================
-- SUPABASE POSTGRESQL DATABASE SCHEMA
-- ==========================================

-- 1. USERS TABLE
-- We link this to the built-in Supabase auth.users table for secure authentication
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    profile_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MEMES TABLE
CREATE TABLE public.memes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploader_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. LIKES TABLE
CREATE TABLE public.likes (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    meme_id UUID REFERENCES public.memes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, meme_id)
);

-- 4. COMMENTS TABLE
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    meme_id UUID NOT NULL REFERENCES public.memes(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. FOLLOWS TABLE
CREATE TABLE public.follows (
    follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    followed_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (follower_id, followed_id)
);

-- 6. MEME_OCR TABLE (For AI Engine)
CREATE TABLE public.meme_ocr (
    meme_id UUID PRIMARY KEY REFERENCES public.memes(id) ON DELETE CASCADE,
    extracted_text TEXT NOT NULL,
    confidence_score DECIMAL(5,2),
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TAGS TABLE
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. MEME_TAGS TABLE (Many-to-Many mapping for Memes and Tags)
CREATE TABLE public.meme_tags (
    meme_id UUID REFERENCES public.memes(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (meme_id, tag_id)
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX idx_memes_uploader ON public.memes(uploader_id);
CREATE INDEX idx_likes_meme ON public.likes(meme_id);
CREATE INDEX idx_comments_meme ON public.comments(meme_id);
CREATE INDEX idx_follows_followed ON public.follows(followed_id);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) STUBS
-- ==========================================
-- Enable RLS on tables to secure them
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meme_ocr ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meme_tags ENABLE ROW LEVEL SECURITY;

-- Policies for public.users
CREATE POLICY "users_select_all" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create a profile for new auth users
CREATE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
