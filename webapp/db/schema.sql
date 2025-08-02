SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: protocol; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.protocol AS ENUM (
    'http',
    'tcp',
    'udp',
    'tcp/udp'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id bigint NOT NULL,
    event_type character varying(100) NOT NULL,
    data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: identities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.identities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    ziti_id character varying(16) NOT NULL,
    name character varying(128) NOT NULL,
    slug character varying(128) NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    is_online boolean DEFAULT false NOT NULL,
    approved boolean DEFAULT false NOT NULL,
    last_seen timestamp with time zone,
    deleted timestamp with time zone
);


--
-- Name: identity_shares_access; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.identity_shares_access (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identity_id uuid NOT NULL,
    share_id uuid NOT NULL
);


--
-- Name: private_https_bindings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.private_https_bindings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    tunnel_binding_id uuid NOT NULL,
    slug character varying(64) NOT NULL,
    ziti_service_id character varying(32) NOT NULL,
    ziti_intercept_id character varying(32) NOT NULL,
    ziti_dial_id character varying(32) NOT NULL,
    ziti_bind_id character varying(32) NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    domain character varying(70) NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    slug character varying(128) NOT NULL,
    name character varying(100) NOT NULL,
    protocol public.protocol NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    CONSTRAINT services_protocol_check CHECK ((protocol = ANY (ARRAY['http'::public.protocol, 'tcp/udp'::public.protocol])))
);


--
-- Name: share_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.share_links (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    expires timestamp with time zone NOT NULL,
    slug character varying(32) NOT NULL,
    service_id uuid NOT NULL,
    one_time_use boolean NOT NULL
);


--
-- Name: shares; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shares (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    service_id uuid NOT NULL,
    user_id uuid NOT NULL,
    slug character varying(32) NOT NULL
);


--
-- Name: tunnel_bindings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tunnel_bindings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    service_id uuid NOT NULL,
    ziti_host_id character varying(32) NOT NULL,
    ziti_intercept_id character varying(32) NOT NULL,
    ziti_dial_id character varying(32) NOT NULL,
    ziti_bind_id character varying(32) NOT NULL,
    ziti_service_id character varying(32) NOT NULL,
    entry_point boolean NOT NULL,
    slug character varying(64) NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: update_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.update_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content text NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(128) NOT NULL,
    last_login timestamp with time zone DEFAULT now() NOT NULL,
    roles text DEFAULT ''::text NOT NULL
);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identities
    ADD CONSTRAINT identities_slug_key UNIQUE (slug);


--
-- Name: identities identities_user_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identities
    ADD CONSTRAINT identities_user_id_name_key UNIQUE (user_id, name);


--
-- Name: identities identities_ziti_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identities
    ADD CONSTRAINT identities_ziti_id_key UNIQUE (ziti_id);


--
-- Name: identity_shares_access identity_shares_access_identity_id_share_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_shares_access
    ADD CONSTRAINT identity_shares_access_identity_id_share_id_key UNIQUE (identity_id, share_id);


--
-- Name: identity_shares_access identity_shares_access_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_shares_access
    ADD CONSTRAINT identity_shares_access_pkey PRIMARY KEY (id);


--
-- Name: private_https_bindings private_https_bindings_domain_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.private_https_bindings
    ADD CONSTRAINT private_https_bindings_domain_user_id_key UNIQUE (domain, user_id);


--
-- Name: private_https_bindings private_https_bindings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.private_https_bindings
    ADD CONSTRAINT private_https_bindings_pkey PRIMARY KEY (id);


--
-- Name: private_https_bindings private_https_bindings_tunnel_binding_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.private_https_bindings
    ADD CONSTRAINT private_https_bindings_tunnel_binding_id_key UNIQUE (tunnel_binding_id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: services services_name_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_name_user_id_key UNIQUE (name, user_id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: services services_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_slug_key UNIQUE (slug);


--
-- Name: share_links share_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.share_links
    ADD CONSTRAINT share_links_pkey PRIMARY KEY (id);


--
-- Name: share_links share_links_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.share_links
    ADD CONSTRAINT share_links_slug_key UNIQUE (slug);


--
-- Name: shares shares_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shares
    ADD CONSTRAINT shares_pkey PRIMARY KEY (id);


--
-- Name: shares shares_service_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shares
    ADD CONSTRAINT shares_service_id_user_id_key UNIQUE (service_id, user_id);


--
-- Name: shares shares_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shares
    ADD CONSTRAINT shares_slug_key UNIQUE (slug);


--
-- Name: tunnel_bindings tunnel_bindings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tunnel_bindings
    ADD CONSTRAINT tunnel_bindings_pkey PRIMARY KEY (id);


--
-- Name: tunnel_bindings tunnel_bindings_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tunnel_bindings
    ADD CONSTRAINT tunnel_bindings_slug_key UNIQUE (slug);


--
-- Name: update_messages update_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.update_messages
    ADD CONSTRAINT update_messages_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_events_created_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_events_created_id ON public.events USING btree (created_at, id);


--
-- Name: idx_events_data_gin; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_events_data_gin ON public.events USING gin (data);


--
-- Name: idx_events_identity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_events_identity_id ON public.events USING btree (((data ->> 'identity_id'::text)));


--
-- Name: idx_events_ids_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_events_ids_type ON public.events USING btree (event_type) WHERE ((data ? 'identity_id'::text) OR (data ? 'service_id'::text));


--
-- Name: idx_events_service_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_events_service_id ON public.events USING btree (((data ->> 'service_id'::text)));


--
-- Name: idx_events_type_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_events_type_created ON public.events USING btree (event_type, created_at);


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: identity_shares_access identity_shares_access_identity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_shares_access
    ADD CONSTRAINT identity_shares_access_identity_id_fkey FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: identity_shares_access identity_shares_access_share_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_shares_access
    ADD CONSTRAINT identity_shares_access_share_id_fkey FOREIGN KEY (share_id) REFERENCES public.shares(id) ON DELETE CASCADE;


--
-- Name: private_https_bindings private_https_bindings_tunnel_binding_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.private_https_bindings
    ADD CONSTRAINT private_https_bindings_tunnel_binding_id_fkey FOREIGN KEY (tunnel_binding_id) REFERENCES public.tunnel_bindings(id) ON DELETE CASCADE;


--
-- Name: private_https_bindings private_https_bindings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.private_https_bindings
    ADD CONSTRAINT private_https_bindings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: services services_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: share_links share_links_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.share_links
    ADD CONSTRAINT share_links_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: shares shares_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shares
    ADD CONSTRAINT shares_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: shares shares_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shares
    ADD CONSTRAINT shares_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tunnel_bindings tunnel_bindings_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tunnel_bindings
    ADD CONSTRAINT tunnel_bindings_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20250413211309'),
    ('20250414154152'),
    ('20250520000000'),
    ('20250520051951'),
    ('20250520051952'),
    ('20250521004548'),
    ('20250702014631'),
    ('20250702014647'),
    ('20250713163208'),
    ('20250720202200'),
    ('20250720202913'),
    ('20250726143447'),
    ('20250728025123');
