using Api.Middlewares;
using Identity.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

#region Services

#region Project Specific Services

builder.Services.AddIdentityService(builder.Configuration);

#endregion

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;
});
;
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

#endregion

var app = builder.Build();

#region Pipeline

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(options =>
{
    options.WithOrigins("http://localhost:4200").AllowCredentials().AllowAnyHeader().AllowAnyMethod();
});

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

#endregion

app.Run();