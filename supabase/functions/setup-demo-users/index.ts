import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DemoUser {
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'technician' | 'operator' | 'consultation';
  organization: string;
  phone: string;
}

const demoUsers: DemoUser[] = [
  {
    email: 'admin@sipresas.es',
    password: 'demo123',
    full_name: 'Juan García Administrador',
    role: 'admin',
    organization: 'Ministerio para la Transición Ecológica',
    phone: '+34 600 000 001'
  },
  {
    email: 'tecnico@sipresas.es',
    password: 'demo123',
    full_name: 'María López Técnico',
    role: 'technician',
    organization: 'Ministerio para la Transición Ecológica',
    phone: '+34 600 000 002'
  },
  {
    email: 'operador@sipresas.es',
    password: 'demo123',
    full_name: 'Carlos Martínez Operador',
    role: 'operator',
    organization: 'Ministerio para la Transición Ecológica',
    phone: '+34 600 000 003'
  },
  {
    email: 'consulta@sipresas.es',
    password: 'demo123',
    full_name: 'Ana Rodríguez Consulta',
    role: 'consultation',
    organization: 'Ministerio para la Transición Ecológica',
    phone: '+34 600 000 004'
  }
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const results = [];

    for (const user of demoUsers) {
      try {
        const createUserResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
            'apikey': serviceRoleKey,
          },
          body: JSON.stringify({
            email: user.email,
            password: user.password,
            email_confirm: true,
            user_metadata: {
              full_name: user.full_name
            }
          })
        });

        const userData = await createUserResponse.json();

        if (!createUserResponse.ok) {
          if (userData.msg?.includes('already registered')) {
            results.push({
              email: user.email,
              status: 'already_exists',
              message: 'Usuario ya existe'
            });
            continue;
          } else {
            results.push({
              email: user.email,
              status: 'error',
              message: userData.msg || 'Error al crear usuario'
            });
            continue;
          }
        }

        const userId = userData.id;

        const profileResponse = await fetch(`${supabaseUrl}/rest/v1/user_profiles`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
            'apikey': serviceRoleKey,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            id: userId,
            full_name: user.full_name,
            role: user.role,
            organization: user.organization,
            phone: user.phone,
            active: true
          })
        });

        if (profileResponse.ok || profileResponse.status === 409) {
          results.push({
            email: user.email,
            status: 'success',
            role: user.role,
            message: 'Usuario creado exitosamente'
          });
        } else {
          const errorData = await profileResponse.text();
          results.push({
            email: user.email,
            status: 'partial',
            message: `Usuario creado pero error en perfil: ${errorData}`
          });
        }

      } catch (error) {
        results.push({
          email: user.email,
          status: 'error',
          message: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Proceso completado',
        results
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
