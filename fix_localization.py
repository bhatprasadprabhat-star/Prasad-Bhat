
import sys

def fix_file():
    with open('constants.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # The Bengali part was updated last turn, so it should have more keys than Gujarati.
    # Let's verify line numbers again by looking for the last keys.
    
    # Missing Gujarati keys to add
    gu_additions = """
    daily_vedic_wisdom: "દૈનિક વૈદિક જ્ઞાન",
    celestial_cycle_continues: "ખગોળિય ચક્ર ચાલુ છે",
    live_muhurtha_feed: "લાઇવ મુહૂર્ત ફીડ",
    prashna_moment_subtitle: "વર્તમાન ક્ષણમાંથી ઝડપી જવાબો",
    prashna_number_label: "પ્રશ્ન ક્રમાંક (1-108)",
    prashna_location_label: "પ્રશ્ન પૂછવાનું સ્થળ",
    ask_question_placeholder: "તમારો પ્રશ્ન અહીં પૂછો...",
    get_answer: "જવાબ મેળવો",
    oracle_insight: "ઓરેકલ આંતરદૃષ્ટિ",
    ask_another_question: "બીજો પ્રશ્ન પૂછો",
    universal_quote_prashna: "\\"જે ક્ષણે તમે પૂછો છો, બ્રહ્માંડ જવાબ આપે છે.\\"",
    cosmic_turbulence_error: "બ્રહ્માંડની ઉર્જા હાલમાં અસ્થિર છે. થોડી વાર પછી ફરી પ્રયાસ કરો.",
    moment_label: "ક્ષણ",
    searching_city_placeholder: "શહેર શોધો...",
    ancient_solutions_subtitle: "આધુનિક સમસ્યાઓ માટે પ્રાચીન ઉકેલો",
    remedy_label: "ઉપાય",
    focus_label: "ધ્યાન",
    instructions_label: "સૂચનાઓ",
    health_vitality: "આરોગ્ય અને જોમ",
    mental_peace: "માનસિક શાંતિ",
    protection: "રક્ષણ",
    karma_dissolution: "કર્મ મુક્તિ",
    saturn_mitigation: "શનિ શાંતિ",
    career_obstacles: "કરિયરના અવરોધો",
    domestic_peace: "કૌટુંબિક શાંતિ",
    intellect: "બુદ્ધિ",
    surya_arghya_title: "સૂર્ય અર્ઘ્ય",
    surya_arghya_desc: "આત્મવિશ્વાસ અને આરોગ્ય માટે ઉગતા સૂર્યને જળ અર્પણ કરો. સૂર્યોદયના ૧ કલાકની અંદર કરવું શ્રેષ્ઠ છે.",
    chandra_shanti_title: "ચંદ્ર શાંતિ",
    chandra_shanti_desc: "મનને શાંત રાખવા અને ભાવનાત્મક સ્થિરતા માટે ચાંદીના ગ્લાસમાં પાણી પીવો.",
    hanuman_chalisa_title: "હનુમાન ચાલીસા",
    hanuman_chalisa_desc: "ડર દૂર કરવા અને રક્ષણ માટે દરરોજ પાઠ કરો.",
    mantra_jaap_title: "મંત્ર જાપ",
    mantra_jaap_desc: "આધ્યાત્મિક રક્ષણ માટે ૧૦૮ વાર \\"ઓમ નમઃ શિવાય\\" નો જાપ કરો.",
    daan_charity_title: "દાન (પરોપકાર)",
    daan_charity_desc: "શનિની અસર ઘટાડવા શનિવારે કાળા તલ અથવા ભોજનનું દાન કરો.",
    ganesh_atharvashirsha_title: "ગણેશ અથર્વશીર્ષ",
    ganesh_atharvashirsha_desc: "કરિયર અને શિક્ષણમાં અવરોધો દૂર કરવા માટે પાઠ કરો.",
    tulsi_seva_title: "તુલસી સેવા",
    tulsi_seva_desc: "દરરોજ તુલસીને જળ અર્પણ કરવાથી ઘરમાં શાંતિ આવે છે.",
    gayatri_mantra_title: "ગાયત્રી મંત્ર",
    gayatri_mantra_desc: "બુદ્ધિની શુદ્ધિ માટે સવાર-સાંજ જાપ કરો.",
    quote_1: "તારાઓ આપણને દબાણ કરતા નથી, તેઓ આપણને પ્રેરણા આપે છે.",
    quote_2: "સમય શ્રેષ્ઠ વૈદ્ય અને શ્રેષ્ઠ ગુરુ છે.",
    quote_3: "દરેક ગ્રહનું ગોચર વિકાસની એક તક છે.",
    quote_4: "બ્રહ્માંડ ભૂમિતિ અને પ્રકાશની ભાષામાં બોલે છે.",
    quote_5: "તારાઓને જાણવા એટલે તમારી જાતને જાણવી.",
    quote_6: "તમારી જન્મકુંડળી તમારા ભાગ્યનો નકશો છે.",
    quote_7: "ચંદ્ર મન પર શાસન કરે છે, સૂર્ય આત્મા પર.",
    daivajna_live: "દૈવજ્ઞ લાઇવ",
    sacred_ritual_clarity: "દૈવી સ્પષ્ટતા માટે પવિત્ર વિધિ",
    your_name_label: "તમારું નામ",
    enter_full_name_placeholder: "તમા્રું પૂરું નામ દાખલ કરો",
    contact_number_label: "સંપર્ક નંબર",
    enter_contact_number_placeholder: "તમારો સંપર્ક નંબર દાખલ કરો",
    complete_your_offering: "તમારી ઓફર પૂર્ણ કરો",
    payment_desc_text: "તમારા સત્રને કન્ફર્મ કરવા માટે કૃપા કરીને ચુકવણી પૂર્ણ કરો.",
    payment_upi_instruction: "UPI દ્વારા ચુકવણી કરવા માટે નીચેના બટન પર ક્લિક કરો.",
    pay_via_upi: "UPI દ્વારા ચુકવણી કરો ➔",
    copy_upi_id: "UPI ID કોપી કરો",
    details_sent_to: "વિગતો મોકલવામાં આવી છે",
    email_simulation_active: "ઈમેલ સિમ્યુલેશન સક્રિય છે",
    email_setup_instruction: "સાચો ઈમેલ મેળવવા માટે સેટિંગ્સમાં EMAIL_USER અને EMAIL_PASS સેટ કરો.",
    email_failed_title: "ઈમેલ સૂચના નિષ્ફળ ગઈ",
    email_failed_msg: "ઈમેલ મોકલતી વખતે તકનીકી ખામી સર્જાઈ હતી.",
    processing: "પ્રક્રિયા ચાલુ છે...",
    dakshina: "દક્ષિણા",
    brief_problem_analysis: "સમસ્યાનું સંક્ષિપ્ત વિશ્લેષણ",
    simple_remedies_2_3: "૨-૩ સરળ ઉપાયો",
    basic_planetary_reason: "મૂળ ગ્રહ કારણ",
    detailed_planet_analysis: "વિગતવાર ગ્રહ વિશ્લેષણ",
    remedies_5_7: "૫-૭ ઉપાયો",
    timeline_for_results: "પરિણામો માટેનો સમયગાળો",
    dosha_explanation: "દોષની સમજૂતી",
    full_birth_chart_breakdown: "સંપૂર્ણ જન્મકુંડળી વિશ્લેષણ",
    dasha_analysis_full: "દશા વિશ્લેષણ",
    marriage_career_marriage: "લગ્ન, કરિયર, નાણાકીય",
    personalized_action_plan: "વ્યક્તિગત કાર્ય યોજના",
    complete_remedy_guide: "સંપૂર્ણ ઉપાય માર્ગદર્શિકા",
    today: "આજે",
    tomorrow: "આવતીકાલે",
    monday: "સોમવાર",
    tuesday: "મંગળવાર",
    wednesday: "બુધવાર",
    thursday: "ગુરુવાર",
    friday: "શુક્રવાર",
    saturday: "શનિવાર",
    sunday: "રવિવાર",
    year_age: "ઉંમર/વર્ષ",
    good_period: "સારો સમય",
    risk_period: "જોખમી સમય",
    career_marriage: "કરિયર/લગ્ન",
    status_auspicious: "શુભ",
    status_inauspicious: "અશુભ",
    status_neutral: "તટસ્થ",
    status_highly_auspicious: "અતિ શુભ",
    elder_care_program: "વૃદ્ધ સંભાળ કાર્યક્રમ",
    special_children_initiative: "વિશેષ બાળકો માટેની પહેલ"
"""

    if 'brand_tagline: "પ્રાચીન જ્ઞાન, આધુનિક તર્ક"' in content:
        # We need to find the one INSIDE the gu block.
        # gu block starts at some point and goes until bn block or end.
        gu_start = content.find('gu: {')
        bn_start = content.find('bn: {', gu_start)
        
        target = 'brand_tagline: "પ્રાચીન જ્ઞાન, આધુનિક તર્ક"'
        pos = content.find(target, gu_start, bn_start)
        
        if pos != -1:
            end_line_pos = content.find('\n', pos)
            new_content = content[:pos] + 'brand_tagline: "પ્રાચીન જ્ઞાન, આધુનિક તર્ક",\n   ' + gu_additions.strip() + content[end_line_pos:]
            
            # Also fix the today_panchanga line which had mixed chars
            new_content = new_content.replace('today_panchanga: "आजનું પંચાંગ"', 'today_panchanga: "આજનું પંચાંગ"')
            
            with open('constants.tsx', 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Successfully updated constants.tsx")
        else:
            print("Target not found in gu block")
    else:
        print("Target 'brand_tagline' string not found")

if __name__ == "__main__":
    fix_file()
