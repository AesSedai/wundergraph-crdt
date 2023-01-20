// https://gist.github.com/relative/ed9c601146c786bdafb214f2e0f12334
const CUID2_FUNCTION = `
-- Tested on PostgreSQL 15.1.
-- https://gist.github.com/srfrog/ef8c9a3a4282b865fb93f429d671d63b
-- https://github.com/paralleldrive/cuid2  56c54483bd7d5dd12343211c14588265e00f0887

CREATE SEQUENCE IF NOT EXISTS "cuid2_seq";

CREATE OR REPLACE FUNCTION _counter() RETURNS VARCHAR AS $$
DECLARE
    val bigint;
BEGIN
    val := nextval('cuid2_seq');
    IF val = 1 OR val > 16777215 THEN
        val := setval('cuid2_seq', floor(random() * 2057)::bigint);
    END IF;
    return _encode_base36(val);
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION _encode_base36(IN digits numeric, IN min_width int = 0) RETURNS text AS $$
DECLARE
    chars char[] := ARRAY['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    ret text:='';
    val numeric:= digits;
BEGIN
    IF digits < 0 THEN
        val := -val;
    END IF;

    WHILE val > 0 OR min_width > 0 LOOP
            ret := chars[(mod(val,36))+1] || ret;
            val := div(val,36);
            min_width := min_width-1;
        END LOOP;
    IF digits < 0 THEN
        ret := '-'||ret;
    END IF;
    RETURN ret;
END;
$$ LANGUAGE PLPGSQL IMMUTABLE;

CREATE OR REPLACE FUNCTION convert_to_integer(v_input text) RETURNS INTEGER AS $$
DECLARE
    v_int_value INTEGER DEFAULT NULL;
BEGIN
    BEGIN
        if (v_input ~* '^\d[A-Fa-f]$') then
            return convert_to_integer(substring(v_input, 1, 1));
        end if;
        if (v_input ~* '^[A-Fa-f]') then
            return 0;
        end if;
        v_int_value := v_input::INTEGER;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Invalid integer value: "%".  Returning NULL.', v_input;
        RETURN 0;
    END;
    RETURN v_int_value;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION _createEntropy(IN length int = 4) RETURNS VARCHAR AS $$
DECLARE
    -- theres 10 numbers in the primes array
    primes int[] := ARRAY[109717, 109721, 109741, 109751, 109789, 109793, 109807, 109819, 109829, 109831];
    entropy varchar := '';
    randomPrime int := 0;
BEGIN
    while length(entropy) < length loop
            randomPrime := primes[floor(random() *   10   + 1)];
            entropy := entropy || _encode_base36(floor(random() * randomPrime)::numeric);
        end loop;
    RETURN entropy;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION _hash(IN input varchar, IN length int = 32) RETURNS VARCHAR AS $$
DECLARE
    salt varchar := _createEntropy(length);
    text varchar := input || salt;
    hash bytea   := digest(text, 'sha3-512');
    arr varchar[];
    tmp varchar  := '';
BEGIN
    for i in 0..63 loop
            tmp := get_byte(hash, i);
            arr[i] = convert_to_integer(tmp);
        end loop;
    RETURN substr(_encode_base36(array_to_string(arr, '')::numeric), 3);
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION _randomLetter() RETURNS VARCHAR AS $$
DECLARE
    -- theres 26 letters in the lowercase alphabet
    alphabet char[] := ARRAY['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
BEGIN
    RETURN alphabet[floor(random() *   26   + 1)]::varchar;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION _createFingerprint() RETURNS VARCHAR AS $$
DECLARE
    fp varchar := '';
BEGIN
    BEGIN
        fp := current_setting('cuid2.fingerprint');
    EXCEPTION WHEN OTHERS THEN END;
    IF fp = '' THEN
        fp := _hash(
            floor((random() + 1) * 2063) || 
            _hash(
                current_setting('application_name') || 
                current_setting('config_file') ||
                current_setting('data_directory') ||
                current_setting('dynamic_shared_memory_type') ||
                current_setting('lc_collate') ||
                current_setting('listen_addresses') ||
                current_setting('log_timezone') ||
                current_setting('shared_memory_type')
            )
        );
        PERFORM set_config('cuid2.fingerprint', fp, false);
    END IF;
    return fp;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION _timestamp() RETURNS VARCHAR AS $$
BEGIN
    return _encode_base36(floor(extract(EPOCH FROM clock_timestamp()) * 1000)::numeric);
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION cuid2(IN prefix varchar = '', IN length int = 24) RETURNS VARCHAR AS $$
DECLARE
    hashInput varchar := '';
    pfx varchar := '';
BEGIN
    hashInput := hashInput || _timestamp() || _createEntropy(length) || _counter() || _createFingerprint();
    IF prefix != '' THEN
        pfx = prefix || '_';
    END IF;
    return pfx || _randomLetter() || substr(_hash(hashInput, length), 2, length-1);
END;
$$ LANGUAGE PLPGSQL;
`
exports.up = async (knex) => {
    await knex.raw(CUID2_FUNCTION)
}

exports.down = async (knex) => {
}
