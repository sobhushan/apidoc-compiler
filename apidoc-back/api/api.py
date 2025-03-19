"""
@api {put} /v1/vendor-user/complete-profile Complete Vendor Profile
@apiVersion 1.0.0
@apiName CompleteProfile
@apiGroup Vendor User
@apiDescription Completes the vendor profile in multiple steps.  
Pass step_id as 1, 2, or 3 to complete different sections of the profile.

@apiHeader {String} Content-Type application/json
@apiHeader {String} client-secret Client Secret
@apiHeader {String="en","ar"} accept-language User language choices: en and ar.
@apiHeader {String} Authorization Authorization token

@apiBody {Number} step_id Step identifier (1, 2, or 3).

@apiBody {String} [bio] Vendor Bio.
@apiBody {String} [business_name] Business Name.
@apiBody {String} [trade_name] Trade Name.
@apiBody {String} [classification] Business Classification (Optional).
@apiBody {String} [mobile_number] Mobile Number.
@apiBody {String} [email_address] Email Address.

@apiBody {Object} [business_national_address] National Address Information.
@apiBody {String} [business_national_address.image] Address Image URL.
@apiBody {String} [business_national_address.address_type] Address Type (e.g., Office, Warehouse).
@apiBody {String} [business_national_address.address_title] Address Title (e.g., HQ, Branch).

@apiBody {Object} [business_representative] Business Representative Details.
@apiBody {String} [business_representative.first_name] Representative First Name.
@apiBody {String} [business_representative.last_name] Representative Last Name.
@apiBody {String} [business_representative.role] Representative Role (e.g., CEO, Manager).
@apiBody {String} [business_representative.gender] Representative Gender.

@apiBody {Object[]} [working_hours] Working Hours.
@apiBody {String} [working_hours.day_name] Day of the week (e.g., Monday, Tuesday).
@apiBody {String} [working_hours.start] Start time (HH:MM format).
@apiBody {String} [working_hours.end] End time (HH:MM format).
@apiBody {Boolean} [working_hours.close] Whether the business is closed on this day.

@apiBody {Object} [socials] Social Media Links (Optional).
@apiBody {String} [socials.linkedin] LinkedIn URL.
@apiBody {String} [socials.facebook] Facebook URL.

@apiBody {String} [referrals] Reference Information (Optional).

@apiExample {json} Request Example:
{
    "step_id": 1,
    "business_name": "Vendor XYZ",
    "trade_name": "XYZ Trading",
    "classification": "Retail",
    "mobile_number": "+123456789",
    "email_address": "vendor@example.com",
    "business_national_address": {
        "image": "https://example.com/image.jpg",
        "address_type": "Office",
        "address_title": "HQ"
    },
    "business_representative": {
        "first_name": "John",
        "last_name": "Doe",
        "role": "CEO",
        "gender": "Male"
    },
    "working_hours": [
        {
            "day_name": "Monday",
            "start": "09:00",
            "end": "18:00",
            "close": false
        },
        {
            "day_name": "Sunday",
            "close": true
        }
    ],
    "socials": {
        "linkedin": "https://linkedin.com/company/vendorxyz",
        "facebook": "https://facebook.com/vendorxyz"
    },
    "referrals": "Reference from ABC Corp."
}
"""